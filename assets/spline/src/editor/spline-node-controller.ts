import { Node, Color, v3 } from "cc";
import Controller from "./base/controller";
import { createLineShape, getNodeWorldPostion } from "./utils";
import { SplineMoveType } from "./types";
import SplineNode from "../spline-node";

const SPLINE_NODE_SIZE = 0.1;

export default class SplineNodeController extends Controller {
  _node: Node = null!;
  _splineNode: SplineNode = null!;

  _directionLineShape: Node = null!;

  positionNode: Node = null!;
  directionNode: Node = null!;
  invDirectionNode: Node = null!;

  constructor(rootNode: Node) {
    super(rootNode);

    this.initShape();
  }

  initShape() {
    this.createShapeNode("BoxController");

    let cube = window.cce.gizmos.ControllerUtils.cube(
      SPLINE_NODE_SIZE,
      SPLINE_NODE_SIZE,
      SPLINE_NODE_SIZE,
      Color.YELLOW
    );
    cube.parent = this.shape;
    this.positionNode = cube;
    this.initAxis(cube, SplineMoveType.Position);
    

    cube = window.cce.gizmos.ControllerUtils.cube(
      SPLINE_NODE_SIZE,
      SPLINE_NODE_SIZE,
      SPLINE_NODE_SIZE,
      Color.YELLOW
    );
    cube.parent = this.shape;
    this.directionNode = cube;
    this.initAxis(cube, SplineMoveType.Direction);

    cube = window.cce.gizmos.ControllerUtils.cube(
      SPLINE_NODE_SIZE,
      SPLINE_NODE_SIZE,
      SPLINE_NODE_SIZE,
      Color.YELLOW
    );
    cube.parent = this.shape;
    this.invDirectionNode = cube;
    this.initAxis(cube, SplineMoveType.InvDirection);

    this._directionLineShape = createLineShape("Direction Line", Color.RED);
    this._directionLineShape.parent = this.shape;

    this.hide();
  }

  onShow() {
    this.registerCameraMovedEvent();
    this.hideDirection();
  }

  onHide() {
    this.unregisterCameraMoveEvent();
  }

  showDirection() {
    this.directionNode.active = true;
    this.invDirectionNode.active = true;
    this._directionLineShape.active = true;

    this.updateLineMesh();
  }

  hideDirection() {
    this.directionNode.active = false;
    this.invDirectionNode.active = false;
    this._directionLineShape.active = false;
  }

  setSplineNode(node: Node, splineNode: SplineNode) {
    this._splineNode = splineNode;
    this._node = node;

    this.adjustControllerSize();
    this.shape!.setWorldPosition(
      getNodeWorldPostion(node, this._splineNode.position)
    );

    this.directionNode.setWorldPosition(
      getNodeWorldPostion(node, this._splineNode.direction)
    );
    this.invDirectionNode.setWorldPosition(
      getNodeWorldPostion(node, this._splineNode.invDirection)
    );

    this.updateLineMesh();
    this.updateController();
  }

  updateLineMesh() {
    //@ts-ignore
    this._directionLineShape.updatePoints([
      this.directionNode.position,
      this.invDirectionNode.position,
    ]);
  }

  getSplineNodeWorldPosition() {
    return this.positionNode.getWorldPosition(v3());
  }
  getSplineNodeWorldDirection() {
    return this.directionNode.getWorldPosition(v3());
  }
  getSplineNodeWorldInvDirection() {
    return this.invDirectionNode.getWorldPosition(v3());
  }
}
