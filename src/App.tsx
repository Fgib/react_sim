import Sim from "./sim"

function App() {
  return (
    <div className='h-screen w-full bg-zinc-400 flex flex-col justify-center items-center'>
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Sim />
      </div>
    </div>
  )
}

export default App
