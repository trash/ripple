interface NodeList {
	forEach(predicate: (element: HTMLElement, index: number,
		nodeList: NodeList | Array<any>) => void)
}

interface Array<T> {
	equals(otherArray: Array<T>): boolean;
	includes(element: T): boolean;
}