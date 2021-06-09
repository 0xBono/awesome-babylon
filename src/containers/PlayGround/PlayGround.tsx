import { Engine, Scene, SceneOptions, EngineOptions } from 'babylonjs';
import { useEffect, useRef } from 'react';
import './PlayGround.module.css';

type CanvasOptions = {
  id: string;
  width: string;
  height: string;
};

interface PlayGroundProps extends CanvasOptions {
  antialias: boolean;
  engineOptions?: EngineOptions;
  sceneOptions?: SceneOptions;
  onRender: (scene: Scene) => void;
  onSceneReady: (scene: Scene) => void;
}

export const PlayGround: React.FC<PlayGroundProps> = (Props) => {
  const canvas = useRef(null);
  const { antialias, engineOptions, sceneOptions, onRender, onSceneReady, ...rest } = Props;

  useEffect(() => {
    if (canvas.current) {
      const engine = new Engine(canvas.current, antialias, engineOptions);
      const scene = new Scene(engine, sceneOptions);
      if (scene.isReady()) {
        onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene: any) => onSceneReady(scene));
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === 'function') {
          onRender(scene);
        }
        scene.render();
      });

      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener('resize', resize);
      }

      return () => {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener('resize', resize);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);
  return <canvas ref={canvas} {...rest} />;
};
