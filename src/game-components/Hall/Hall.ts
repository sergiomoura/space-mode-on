class Hall {

  private readonly selectEnemies: HTMLSelectElement;
  private readonly selectFriends: HTMLSelectElement;
  private readonly inputPlayerName: HTMLInputElement;
  private readonly divHall: HTMLDivElement;
  private readonly formGameSettings: HTMLFormElement;
  private readonly transitionDuration: number = 0.3;
  
  constructor () {

    // Capturando elementos
    this.selectEnemies = <HTMLSelectElement> document.getElementById('nEnemies');
    this.selectFriends = <HTMLSelectElement> document.getElementById('nFriends');
    this.inputPlayerName = <HTMLInputElement> document.getElementById('playerName');
    this.divHall = <HTMLDivElement> document.getElementById('hall');
    this.formGameSettings = <HTMLFormElement> document.getElementById('gameSettings');
    this.divHall.style.transition = `opacity linear ${this.transitionDuration}s`;
  
  }

  public connect (): void {
     
    // Associando eventos
    this.formGameSettings.addEventListener(
      'submit',
      evt => {

        evt.preventDefault();
        this.onFormSubmit();
      
      }
    );

    window.addEventListener(
      'load',
      () => { this.inputPlayerName.focus(); }
    );

  }
  
  public get nEnemies (): number {

    return parseInt(this.selectEnemies.value);
  
  }
  
  public get nFriends (): number {

    return parseInt(this.selectFriends.value);
  
  }
  
  public get playerName (): string {

    return this.inputPlayerName.value;
  
  }

  public show (died: boolean = true): void {
    
    this.divHall.style.display = 'flex';
    this.divHall.style.opacity = '1';
  
  }

  public hide (): void {

    this.divHall.style.opacity = '0';
    this.divHall.addEventListener(
      'transitionend',
      () => { this.divHall.style.display = 'none'; }
    );
  
  }

  public onFormSubmit: () => void = () => { console.log('começou'); };

}

export default Hall;
