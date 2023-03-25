class Hall extends EventTarget {

  public static readonly SUBMIT: string = 'submit';
  
  constructor (
    private readonly selectEnemies: HTMLSelectElement,
    private readonly selectFriends: HTMLSelectElement,
    private readonly inputPlayerName: HTMLInputElement,
    private readonly divHall: HTMLDivElement,
    private readonly formGameSettings: HTMLFormElement
  ) {
    
    super();
  
  }

  public connect (): void {
     
    // Associando eventos
    this.formGameSettings.addEventListener(
      'submit',
      evt => {

        evt.preventDefault();
        this.dispatchEvent(new Event(Hall.SUBMIT));
      
      }
    );

    this.inputPlayerName.focus();

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

  public show (victory: boolean = true): void {
    
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

}

export default Hall;
