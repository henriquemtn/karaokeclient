interface CustomProps {
    music: string,
    artist: string,
    usuario: string,
}

export default function NextSong({music, artist, usuario}: CustomProps) {
  return (
    <div className="flex justify-center flex-col w-full p-2 h-[101.75px] bg-gradient-to-r from-violet-800 to-violet-600 rounded-md">
        <h1 className="text-white font-medium">{music}</h1>
        <h1 className="text-[#9D9D9D] font-medium">{artist}</h1>
        <h1 className="text-white font-medium">{usuario}</h1>
    </div>
  )
}