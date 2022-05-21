import { Vector3 } from "three";
import Ship from "./Ship";


describe(
    'Testando Ship', () =>{
        
        let ship:Ship = new Ship(false);

        test('Espera-se que a vida seja 50',()=>{
                expect(ship.life).toBe(50);
            }
        );

        test('Espera-se que a nave inicie parada',()=>{
            expect(ship.velocity).toEqual(new Vector3(0,0,0));
        });

         test('Está tomando dano...',  ()=>{
             ship.getDemage(10);
             expect(ship.life).toBe(40)
         })
         
    }
)