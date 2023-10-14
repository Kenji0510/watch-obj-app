// パッケージのインポート
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

// コンポーネントのインポート
import Footer from "./Footer";

// caaのインポート
import "./App.css";
import ModelView from "./ModelView";

function App() {
  const [selectedModel, setSelectedModel] = useState<number>(0);
  const [model, setModel] = useState<string[]>([
  ]);
  const API_URL = 'http://192.168.0.25:8081/';
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //const model_url = ['https://some-anyone-data.s3.ap-northeast-3.amazonaws.com/public_obj/hotel_in_sunshine/Scaniverse_2023_08_28_184503.obj'];


  useEffect(() => {
    const fetchObjInfoData = async() => {
      setIsLoading(true);
      
      try {
        let response = await fetch(API_URL);
        let result = await response.json();
        console.log(result);

        const fetchedData = await result.map((item: any) => item.ObjFileURL);
        setModel(fetchedData);
        console.log(fetchedData);
      } catch (error) {
        console.log("Error fetching the data:", error);
      }

      setIsLoading(false);
    };

    fetchObjInfoData();
  }, []);


  return (
    <div className="App">
      <h1 className="Title">OBJファイル可視化サイト</h1>
      {isLoading ? (<p>Loading...</p>) : (
        <>
        <div className="model_switch_button">
          {model.map((_, index) => {
            return (
              <div className={`${index === selectedModel ? "selected" : ""}`} key={index} onClick={() => {
                setSelectedModel(index);
              }}
              >
            {index + 1}
            </div>
            );
          })}
        </div>
        {/* ここから削除 */}
        { (
          <Canvas className="canvas">
            <ModelView model_url={model[selectedModel]} key={selectedModel} />
          </Canvas>
        )}
        <Footer />
        {/* ここまで */}
        <Footer />
        </>
      )}
    </div>
  );
}

export default App;
