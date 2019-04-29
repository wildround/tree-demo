/**
 *  Tree View implementation example
 */
var TreeView = (function () {
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
		addNode(value, id) {
			if (!this.root) {
				this.root = new Node(value);
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

	class TreeView {
		constructor(id) {
			// init tree  tree container
			this.container = document.getElementById(id || "tree-container");

			// init tree data structure
			this.tree = new Tree();
			this.tree.addNode("Root");
			this.viewRoot = this.createRoot(this.container, this.tree.root);
		}

		createContextMenu(target) {
			const cm = document.createElement("div");
			cm.className = "custom-cm";

			const add = document.createElement("div");
			add.className = "custom-cm-item";
			add.textContent = "Add node";
			add.onclick = this.onAddNode;

			const rename = document.createElement("div");
			rename.className = "custom-cm-item";
			rename.textContent = "Rename node";
			rename.onclick = this.onRenameNode;

			const del = document.createElement("div");
			del.className = "custom-cm-item";
			del.textContent = "Delete node";
			del.onclick = this.onDeleteNode;

			cm.appendChild(add);
			cm.appendChild(rename);
			cm.appendChild(del);

			target.appendChild(cm);
		}

		onAddNode(event) {
			const clickedNode = $(".children ul")[0] || $(".children")[0];
			if (!clickedNode) return;
			const ul = document.createElement("ul");
			const li = document.createElement("li");
			const span = document.createElement("span");
			const children = document.createElement("ul"); // children container
			children.className = "children";
			span.className = "parent";
			span.textContent = "New Node";

			li.appendChild(span);
			li.appendChild(children);
			ul.appendChild(li);
			ul.addEventListener("click", this.clickHandler);

			clickedNode.appendChild(ul);

			const cm = document.querySelector(".custom-cm");
			cm.style.display = "none";
		}

		onRenameNode(event) {
			console.log("on rename node: ", event);
		}

		onDeleteNode(event) {
			console.log("on delete node: ", event);
		}

		createRoot(target, root) {
			const ul = document.createElement("ul");
			const li = document.createElement("li");
			const span = document.createElement("span");
			const children = document.createElement("ul"); // children container
			children.className = "children";
			span.className = "parent";
			span.textContent = root.value;
			span.id = root.id;

			li.appendChild(span);
			li.appendChild(children);
			ul.appendChild(li);
			ul.addEventListener("click", this.clickHandler);
			ul.addEventListener("contextmenu", this.contextMenuHandler, false);

			this.createContextMenu(span);

			target.appendChild(ul);

			return children;
		}

		createChild(target, text) {
			const li = document.createElement("li");
			li.textContent = text;

			target.appendChild(li);

			return target;
		}

		createParent(target, text) {
			const ul = document.createElement("ul");
			const li = document.createElement("li");
			const span = document.createElement("span");
			const children = document.createElement("ul"); // children container
			children.className = "children";
			span.className = "parent";
			span.textContent = text;

			li.appendChild(span);
			li.appendChild(children);
			ul.appendChild(li);
			ul.addEventListener("click", this.clickHandler);

			target.appendChild(ul);

			return children;
		}

		clickHandler(event) {
			event.stopPropagation();

			const target = event.target;
			const children = this.parentElement.querySelector(".children");
			if (children.classList) {
				children.classList.toggle("active");
			}

			if (target.classList) {
				target.classList.toggle("parent-down");
			}
		}

		showContextMenu(show = true) {
			const cm = document.querySelector(".custom-cm");
			cm.style.display = show ? "block" : "none";
		}

		contextMenuHandler(event) {
			event.preventDefault();
			const cm = document.querySelector(".custom-cm");
			cm.style.display = "block";
			cm.style.left = event.pageX + "px";
			cm.style.top = event.pageY + "px";
		}

		run() {
			this.root = this.createParent(this.container, "Beverages");
			this.createChild(this.root, "Water");
			this.createChild(this.root, "Coffee");
			this.tea = this.createParent(this.root, "Tea");
			this.createChild(this.tea, "Black Tea");
			this.createChild(this.tea, "White Tea");
		}
	}

	return TreeView;
}());

