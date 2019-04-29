/**
 *  Node class example
 */
var Tree = (function () {
    class Node {
        constructor(value = "root") {
            this.value = value;
            this.children = [];
            this.parent = null;
            this.id = ++Node.counter;
        }

        setParentNode(node) {
            this.parent = node;
        }

        getParentNode() {
            return this.parent;
        }

        addChild(node) {
            node.setParentNode(this);
            this.children[this.children.length] = node;
        }

        getChildren() {
            return this.children;
        }

        removeChildren() {
            this.children = [];
        }

        removeNode() {
            delete this.value;
            delete this.children;
            delete this.parent;
            delete this.id;
        }
    }
    Node.counter = 0;

    class Tree {
        constructor() {
            this.root = null;
        }

        printTree() {
            const print = node => {
                if (node.children) node.children.forEach(child => print(child));
                console.log(node);
            }
            print(this.root);
        };

        // add a node to node with provided id
        addNode(id, value) {
            if (!this.root) {
                this.root = node;
            } else {
                const parentNode = this.findID(id) || this.root;
                parentNode.addChild(new Node(value));
            }
        }

        // delete node by provided id;
        deleteNode(id) {
            const node = this.findID(id);
            if (!node) return;

            const parentNode = node.getParentNode();
            const deleteNode = node => {
                if (node.children) node.children.forEach(child => {
                    deleteNode(child);
                });
                node.removeNode();
            };

            deleteNode(node);

            if (Object.keys(this.root).length) parentNode.children = parentNode.children.filter(child => Object.keys(child).length);
        }

        // performs look by unique id
        findID(id) {
            const lookup = (id, node) => {
                if (node.id === id) {
                    return node;
                } else if (node.children && node.children.length > 0) {
                    let i = 0;
                    let result = null;
                    for (i = 0; result == null && i < node.children.length; i++) {
                        result = lookup(id, node.children[i]);
                    }
                    return result;
                }
                return null;
            };

            return lookup(id, this.root);
        }

        // load external data and convert data to the Tree structure
        load(data) {
            if (!data) return;
            const applyToTree = (root, node) => {
                if (!root) root = new Node(node.value);
                if (node.children) node.children.forEach(child => {
                    const node = new Node(child.value);
                    root.addChild(node);
                    applyToTree(child.children && child.children.length > 0 ? node : root, child);
                });
                return root;
            }
            this.root = applyToTree(null, data);
        }
    }

    return Tree;
}());
