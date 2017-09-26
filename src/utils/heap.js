/* eslint no-param-reassign: 0 */
import baseRangeRight from 'lodash/rangeRight';

/**
 * Creates an array of numbers in descending order from start to end, both included.
 */
export function reverseRange(from, to = 0) {
  return baseRangeRight(to, from + 1);
}

/**
 * Swap two items in an array
 * @param array Input array, whose elements are swapped
 * @param from From index
 * @param to Destination index
 */
export function swap(input, from, to) {
  const temp = input[from];
  input[from] = input[to];
  input[to] = temp;

  return input;
}

/**
 * Return the index of the parent in the heap.
 * Time complexity: O(1)
 * @param index Index of the current node
 */
export function parent(index) {
  return Math.floor((index - 1) / 2);
}

/**
 * Return the index of the left child in the heap.
 * Time complexity: O(1)
 * @param index Index of the current node
 */
export function left(index) {
  return (2 * index) + 1;
}

/**
 * Return the index of the right child in the heap.
 * Time complexity: O(1)
 * @param index Index of the current node
 */
export function right(index) {
  return 2 * (index + 1);
}

function isInHeap(index, heapSize) {
  return index < heapSize;
}

/**
 * Place the element in the right position of the max-heap. It assumes child nodes
 * are valid heaps.
 * Time complexity: O(lg(n))
 * @param input Array rappresented by the heap
 * @param index Index of the element to place
 * @param heapSize Size of the heap
 */
export function maxHeapify(input, index, heapSize, field) {
  const leftChild = left(index);
  const rightChild = right(index);
  let maxIndex = index;

  if (isInHeap(leftChild, heapSize) && input[leftChild][field] > input[index][field]) {
    maxIndex = leftChild;
  }

  if (isInHeap(rightChild, heapSize) && input[rightChild][field] > input[maxIndex][field]) {
    maxIndex = rightChild;
  }

  if (maxIndex !== index) {
    swap(input, index, maxIndex);
    // Repeat max-heap check for the subtree
    maxHeapify(input, maxIndex, heapSize, field);
  }

  return input;
}

export function minHeapify(input, index, heapSize, field) {
  const leftChild = left(index);
  const rightChild = right(index);
  let minIndex = index;

  if (isInHeap(leftChild, heapSize) && input[leftChild][field] < input[index][field]) {
    minIndex = leftChild;
  }

  if (isInHeap(rightChild, heapSize) && input[rightChild][field] < input[minIndex][field]) {
    minIndex = rightChild;
  }

  if (minIndex !== index) {
    swap(input, index, minIndex);
    // Repeat min-heap check for the subtree
    minHeapify(input, minIndex, heapSize, field);
  }

  return input;
}

/**
 * Build max-heap from input.
 * Time complexity: O(n)
 * @param input Array to build the max-heap from
 */
export function buildMaxHeap(input, field) {
  // All nodes from (input.length / 2) + 1 are leaves
  const firstLeaf = Math.floor((input.length - 1) / 2);

  reverseRange(firstLeaf).forEach((index) => {
    maxHeapify(input, index, input.length, field);
  });

  return input;
}

export function buildMinHeap(input, field) {
  // All nodes from (input.length / 2) + 1 are leaves
  const firstLeaf = Math.floor((input.length - 1) / 2);

  reverseRange(firstLeaf).forEach((index) => {
    minHeapify(input, index, input.length, field);
  });

  return input;
}
