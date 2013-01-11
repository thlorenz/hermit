var render = module.exports = function render(nodes) {
  function processNode(node) {
    return node.text;
  }

  return nodes.map(processNode).join('');
};
