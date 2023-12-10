/* filename: complex_code.js */

// This code is a complex example of a library for handling geometric calculations in 2D space.

// Define a class for a point in 2D space
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Calculate the distance to another point
  distanceTo(otherPoint) {
    const dx = otherPoint.x - this.x;
    const dy = otherPoint.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Move the point by given offsets
  moveBy(offsetX, offsetY) {
    this.x += offsetX;
    this.y += offsetY;
  }
}

// Define a class for a 2D vector
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Calculate the length of the vector
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Add two vectors
  static add(vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
  }

  // Subtract two vectors
  static subtract(vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }

  // Calculate the dot product of two vectors
  static dotProduct(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
  }

  // Calculate the cross product of two vectors
  static crossProduct(vector1, vector2) {
    return vector1.x * vector2.y - vector1.y * vector2.x;
  }
}

// Define a class for a line segment
class LineSegment {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.vector = Vector.subtract(endPoint, startPoint);
  }

  // Calculate the length of the line segment
  get length() {
    return this.vector.length;
  }
  
  // Check if a point is on the line segment
  containsPoint(point) {
    const vectorToPoint = Vector.subtract(point, this.startPoint);
    const dotProduct = Vector.dotProduct(this.vector, vectorToPoint);

    if (dotProduct < 0 || dotProduct > this.vector.length) {
      return false;
    }
    
    const crossProduct = Vector.crossProduct(this.vector, vectorToPoint);
    return Math.abs(crossProduct) < Number.EPSILON;
  }
}

// Usage example
const startPoint = new Point(0, 0);
const endPoint = new Point(5, 5);
const lineSegment = new LineSegment(startPoint, endPoint);

console.log("Length of the line segment:", lineSegment.length);
console.log("Is (2, 2) on the line segment?", lineSegment.containsPoint(new Point(2, 2)));