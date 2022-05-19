import DashPill from "./DashPill";

let dp:DashPill = new DashPill(1,2,3);

describe("Testes em DashPill",()=>{
    test('Espera-se que a duração da dash pill seja 1', () => { 
      expect(dp.duration).toBe(1);
    });
    
    test('Espera-se que a velocidade da dash pill seja 2', () => { 
        expect(dp.speed).toBe(2);
    });
    
    test('Espera-se que a aceleração da dash pill seja 3', () => { 
        expect(dp.acceleration).toBe(3);
    });
})