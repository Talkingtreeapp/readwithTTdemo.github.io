var wordsIndex = {};

function speak(obj) {
  wordsIndex = {};

  // Get the parameter values from the input sliders
  var r = parseFloat(document.getElementById('rate').value);
  var p = parseFloat(document.getElementById('pitch').value);
  var v = parseFloat(document.getElementById('volume').value);

  $(obj).articulate('rate', r)
    .articulate('pitch', p)
    .articulate('volume', v)    
    .articulate('speak', {
      onWordFound: function (e) {

        $('#word').text(e.word);

        var term = e.word;
        var position = wordsIndex[term];

        position = (position) ?
          ((e.charIndex > position.start + position.length) ?
            { index: position.index + 1, start: e.charIndex, length: term.length } :
            { index: position.index, start: position.start, length: position.length }) :
          { index: 0, start: e.charIndex, length: term.length };
        wordsIndex[term] = position;

        $(obj).unmark().mark(term, {
          element: "span",
          className: "marked-text",
          separateWordSearch: false,
          diacritics: false,
          caseSensitive: true,
          accuracy: "exactly",
          filter: function (textNode, foundTerm, totalCounter, counter) {
            return counter <= position.index;
          },
          done: function (counter) {
            $(obj).find('span.marked-text').last().addClass('highlight');
          },
        });

        //$(obj).unmark().markRanges([{start: e.charIndex, length: e.charLength}]);
      }
    });
};

function pause() {
  $().articulate('pause');
};

function resume() {
  $().articulate('resume');
};

function stop() {
  $().articulate('stop');
  $().unmark();
};

// update the value to the right of the input sliders
function update(obj, value) {
  var n = parseFloat(value).toFixed(1)
  $(obj).parent().find('span').text(n);
};

onload = _ => {
  /*
   * Check for browser support
   */
  var supportMsg = document.getElementById('msg');

  if ('speechSynthesis' in window) {
    supportMsg.innerHTML = 'Your browser <strong>supports</strong> speech synthesis.';
  } else {
    supportMsg.innerHTML = 'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="https://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
    supportMsg.classList.add('not-supported');
  }

  // Get the voice select element.
  setTimeout(() => {
    $().articulate('getVoices', '#voice', 'Select a new voice').articulate('setVoice', 'language', 'en-In');
  }, 500);


  $('#reload ').on('click', e => {
    $().articulate('getVoices', '#voice', 'Select a new voice').articulate('setVoice', 'language', 'en-In');
  })
}