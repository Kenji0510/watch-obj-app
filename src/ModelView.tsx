// パッケージのインポート
import { useRef, Suspense, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { Mesh } from "three";
import { OrbitControls as OrbitControlImpl } from "three-stdlib";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls, Preload, PerspectiveCamera, Center, Html, useProgress } from "@react-three/drei";

// ModelViewのpropsの型定義
type ModelViewProps = {
  model_url: string;
  key: number;
};

{/*
// モデルローダー
const Model = (args: any) => {
  const model = useLoader(OBJLoader, args.model_url as string);
  model.rotation.x = -1.5;

  return (
    <primitive
      object={model}
      ref={args.mesh as Mesh}
      scale={[0.1, 0.1, 0.1]}
      {...args}
    />
  );
};
*/}

function Loading() {
  const { progress } = useProgress();
  console.log(progress + "% loading...");
  return <Html className="loading"></Html>
}

const Model = (args: any) => {
  const group = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(args.model_url.replace('.obj', '.mtl'), (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(args.model_url, (model) => {
        group.current!.add(model);
      });
    });
  }, [args.model_url]);

  return <group ref={group} />;
};

function ModelView(props: ModelViewProps) {
  // コントローラー用Refの定義
  const controlRef = useRef<OrbitControlImpl>({} as OrbitControlImpl);
  //   メッシュ定義
  const mesh = useRef({} as Mesh);

  return (
    <>
      {/* ローディングが終わるまでは何も表示しない */}
      <Suspense fallback={<Loading />}>
        {/* 上記で定義したモデルローダーで表示される3Dモデル */}
        <Center>
            <Model mesh={mesh} model_url={props.model_url} position={[0, 0, 0]} />
        </Center>
        <Preload all />
        {/* 遠近カメラ */}
        <PerspectiveCamera
          makeDefault
          args={[35, window.innerWidth / window.innerHeight, 0.1, 2000]}
          position={[-5, 4, 5]}
        />
        {/*環境光の追加*/}
        <ambientLight color='white' intensity={0.5} />
        {/**/}
        <directionalLight color='white' intensity={0.8} position={[1, 5, 5]} />
      </Suspense>
      {/* マウスでの操作を可能にする */}
      <OrbitControls makeDefault ref={controlRef} />
      {/* xyz軸を表示 */}
      <axesHelper />
    </>
  );
}
// ModelViewコンポーネントとして出力
export default ModelView;