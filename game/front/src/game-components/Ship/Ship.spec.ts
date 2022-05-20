import Ship from "./Ship";

describe(
    'Testando Ship', () =>{

        test(
            'Espera-se que a vida seja 50',
            () => {
                let ship:Ship = new Ship(false);
                expect(ship.life).toBe(50);
                
            }
        )
    }
)