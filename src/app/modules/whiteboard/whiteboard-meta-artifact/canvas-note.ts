import { fabric } from 'fabric';

export interface CanvasNoteInit {
  color: string | undefined;
  darkerColor: string | undefined;
  point: fabric.Point;
}

interface CanvasNoteFromObjectInit {
  objects?: fabric.Object[];
  options?: fabric.IGroupOptions;
  isAlreadyGrouped?: boolean;
}

export interface CanvasNoteConstructor {
  new (
    init?: CanvasNoteInit,
    fromObject?: CanvasNoteFromObjectInit
  ): CanvasNote;

  // eslint-disable-next-line @typescript-eslint/ban-types
  fromObject: Function;
}

export interface CanvasNote extends fabric.Group {
  setFillColor(color: string | undefined, darker: string | undefined): void;

  setStrokeColor(color: string | undefined): void;

  getTextbox(): fabric.Textbox;

  getTriangle(): fabric.Polygon;

  getRectangle(): fabric.Polygon;
}

export const CanvasNote: CanvasNoteConstructor = fabric.util.createClass(
  fabric.Group,
  {
    type: 'canvasNote',

    initialize: function (
      init?: CanvasNoteInit,
      fromObject?: CanvasNoteFromObjectInit
    ): void {
      if (init != null) {
        const width = 200;
        const height = 100;
        const text = new fabric.Textbox('Note...', {
          originX: 'center',
          originY: 'center',
          width: 100,
        });
        const noteRect = new fabric.Polygon(
          [
            { x: -width / 2, y: -height / 2 },
            { x: width / 2 - 20, y: -height / 2 },
            { x: width / 2, y: -height / 2 + 20 },
            { x: width / 2, y: height / 2 },
            { x: -width / 2, y: height / 2 },
          ],
          {
            fill: init.color,
            shadow: new fabric.Shadow({
              offsetY: 5,
              color: 'rgba(0,0,0,0.25)',
            }),
            selectable: false,
          }
        );
        const noteTriangle = new fabric.Polygon(
          [
            { x: width / 2 - 20, y: -height / 2 },
            { x: width / 2 - 20, y: -height / 2 + 20 },
            { x: width / 2, y: -height / 2 + 20 },
          ],
          {
            fill: init.darkerColor,
            selectable: false,
          }
        );
        this.callSuper('initialize', [noteRect, noteTriangle, text], {
          left: init.point.x - 100,
          top: init.point.y - 50,
          fill: init.color,
        });
      } else if (fromObject != null) {
        this.callSuper(
          'initialize',
          fromObject.objects,
          fromObject.options,
          fromObject.isAlreadyGrouped
        );
        this.getRectangle().set('selectable', false);
        this.getTriangle().set('selectable', false);
      } else {
        throw new Error('Either init or fromObject must be provided!');
      }

      this._initEventListeners();
    },

    /**
     * @private
     */
    _initEventListeners: function (this: CanvasNote): void {
      const mousedblclickHandler = (): void => {
        const text = this.getTextbox();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const canvas = this.canvas!;
        this.off();
        const objects = this.getObjects();
        this.destroy();
        canvas.remove(this);
        canvas.add(...objects);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        const handleExitEditing = (): void => {
          canvas.off('save', handleExitEditing);
          text.off('editing:exited', handleExitEditing);
          canvas.remove(...objects);
          const note = new CanvasNote(undefined, { objects });
          canvas.add(note);
        };
        text.on('editing:exited', handleExitEditing);
        canvas.on('save', handleExitEditing);
      };
      this.on('mousedblclick', mousedblclickHandler);
    },

    _set(this: CanvasNote, key: string, value: unknown): fabric.Object {
      if (key === 'strokeWidth' && this._objects.length === 3) {
        this.getRectangle().set('strokeWidth', value as number);
        this.getTriangle().set('strokeWidth', value as number);
      }
      return fabric.Group.prototype._set.call(this, key, value);
    },

    setFillColor(
      this: CanvasNote,
      color: string | undefined,
      darker: string | undefined
    ): void {
      this.getRectangle().set('fill', color);
      this.getTriangle().set('fill', darker);
      this.set('fill', color);
    },

    setStrokeColor(this: CanvasNote, color: string | undefined): void {
      this.getRectangle().set('stroke', color);
      this.getTriangle().set('stroke', color);
      this.set('stroke', color);
    },

    getTextbox: function (this: CanvasNote): fabric.Textbox {
      return this.item(2) as unknown as fabric.Textbox;
    },

    getTriangle: function (this: CanvasNote): fabric.Polygon {
      return this.item(1) as unknown as fabric.Polygon;
    },

    getRectangle: function (this: CanvasNote): fabric.Polygon {
      return this.item(0) as unknown as fabric.Polygon;
    },
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
CanvasNote.fromObject = function (object: any, callback: Function): void {
  fabric.util.enlivenObjects(
    object.objects,
    function (enlivenedObjects: fabric.Object[]): void {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const options = fabric.util.object.clone(object, true);
      delete options.objects;
      callback(
        new CanvasNote(undefined, {
          objects: enlivenedObjects,
          options,
          isAlreadyGrouped: true,
        })
      );
    },
    'fabric'
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(fabric as any).CanvasNote = CanvasNote;
