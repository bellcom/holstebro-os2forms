var b = Drupal.behaviors.webform_tracking;

QUnit.test("history_add: Deduplicate data", function(assert) {
  var history = [];
  b.history_add(history, '1');
  b.history_add(history, '1');
  b.history_add(history, '2');
  b.history_add(history, '2');
  b.history_add(history, '1');
  assert.deepEqual(['1', '2', '1'], history);
});

QUnit.test("history_add: Too much data", function(assert) {
  var history = [];
  for (var i = 1; i <= 15; i++) {
    b.history_add(history, i.toString());
  }
  assert.equal('1', history[0], 'Keep first item when truncating.');
  assert.deepEqual(['13', '14', '15'], history.slice(-3), 'Keep last three entries when truncating.');
});

QUnit.test("extract_parameters: utm_source candidates", function(assert) {
  var parameters = {
    utm_source: 'utm_source',
  };
  var data = b.extract_parameters(parameters);
  assert.equal('utm_source', data.source);

  parameters.s = 's';
  var data = b.extract_parameters(parameters);
  assert.equal('s', data.source);

  parameters.source = 'source';
  var data = b.extract_parameters(parameters);
  assert.equal('source', data.source);
});
