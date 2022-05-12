import { fromEvent, merge } from "rxjs";
import { filter, map } from "rxjs/operators";

export type PressedKeys = string[];

const pressedKeys:PressedKeys = [];

export const ObservableKeyboard = merge(
    fromEvent(document.body,'keypress'),
    fromEvent(document.body, 'keyup')
).pipe(
    filter(
        (evt:KeyboardEvent) => {

            let keyPosition = pressedKeys.indexOf(evt.key);
            let keyIsPressed:boolean = keyPosition > -1;

            if(evt.type=='keypress' && keyIsPressed){
                return false;
            }

            if(evt.type=='keypress' && !keyIsPressed){
                pressedKeys.push(evt.key);
                return true;
            }

            if(evt.type=='keyup'){
                pressedKeys.splice(keyPosition,1);
                return true;
            }
        }
    ),
    map(
        () => {
            return pressedKeys
        }
    )
)

export default {}