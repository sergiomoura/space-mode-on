import Game from '../Game/Game'

class Hall {
  private readonly nEnimies: number
  private readonly nFriends: number

  static connect (hallElement: HTMLElement): void {
    hallElement.querySelector('#btJogar')?.addEventListener(
      'click',
      () => {
        this.createGame()
        document.getElementById('hall')?.remove()
      }
    )
  }

  private static createGame (): void {
    // Recuperando os canvas
    const mainCanvas = document.getElementById('mainCanvas') as HTMLCanvasElement
    const auxCanvas = document.getElementById('auxCanvas') as HTMLCanvasElement

    // Criando o jogo
    const game = new Game(
      window.innerHeight,
      window.innerWidth,
      mainCanvas,
      auxCanvas,
      'Sérgio Moura'
    )
    console.log(game)
  }
}

export default Hall
