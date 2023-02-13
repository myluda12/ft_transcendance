import p5 from 'p5';
import SketchPong from './My_sketch';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FunctionComponent, useState } from 'react';


// export class Paddle {
//     p5: p5;
//     x: number;
//     y: number;
//     width: number = 10;
//     height: number = 50;
  
//     constructor(p5: p5, x: number, y: number) {
//       this.p5 = p5;
//       this.x = x;
//       this.y = y;
//     }
  
//     move(y: number) {
//       this.y = y;
//     }
  
//     show() {
//       this.p5.rect(this.x, this.y, this.width, this.height);
//     }

//     test(p5: p5) {
//         this.show();
//     }
      
//   }
//<button onClick={() => joinRoom()}>Join Room</button>



type Props = {
  value: any;
};


export const Lobby: FunctionComponent<Props>  = (props: any) => {

  function joinRoom() {
    // console.log("Ana hna " + props.value);
    return <SketchPong/>;
    <Route path='/' element={<SketchPong/>} />
  }
  return (
  <div>
  <button onClick={() => joinRoom()}>Join Room</button>
  </div>)
}


export function MessageInput({joinRoom}: {joinRoom:() => void}) {
  const [value, setValue] = useState<string>("")
  // console.log(value);
return (
  <>
  <div>
      <button onClick={() => setValue("waqila")}>Join Room</button>
  </div>
  </>
)
}


  export class Paddle {
    //p5: p5;
    x: number;
    y: number;
    width: number;
    height: number;
  
    constructor(x: number, y: number, width: number, height: number) {
      //this.p5 = p5;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    move(y: number) {
      this.y = y;
    }
  
    show() {
      //this.p5.rect(this.x, this.y, this.width, this.height);
    }

    test(p5: p5) {
        this.show();
    }
      
  }
