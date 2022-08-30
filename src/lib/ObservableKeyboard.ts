import { fromEvent, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export type PressedKeys = string[];

const pressedKeys: PressedKeys = [];

export const ObservableKeyboard = merge(
  fromEvent(document.body, 'keypress'),
  fromEvent(document.body, 'keyup')
).pipe(
  filter(
    (evt: KeyboardEvent) => {

      const keyPosition = pressedKeys.indexOf(evt.code);
      const keyIsPressed: boolean = keyPosition > -1;

      if (evt.type === 'keypress' && keyIsPressed) {

        return false;
      
      }

      if (evt.type === 'keypress' && !keyIsPressed) {

        pressedKeys.push(evt.code);
        return true;
      
      }

      if (evt.type === 'keyup') {

        pressedKeys.splice(keyPosition, 1);
        return true;
      
      }
      return false;
    
    }
  ),
  map(
    () => {

      return pressedKeys;
    
    }
  )
);

export default {};
