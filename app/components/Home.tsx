'use client'
import { addImage, deleteImages, getImages, updateImagesInfo } from "@/actions"
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { useEffect, useState } from "react"
import type { Image, TagType } from "@/types"
import Button from "./ui/Button"
import { CrossIcon, PencilIcon } from "./ui/Icons"
import { TypyPaznokci } from "../utils/utils"

function Home() {
    const[images, setImages] = useState<Image[]>([])
    const[selectedImages, setSelectedImages] = useState<Image[]>([])
    const[selectedImageType, setSelectedImageType] = useState<"edit" | "delete" | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      const images = await getImages()
      setImages(images)
    }
    fetchImages()
  }, [])


  const handleImageClick = (image: Image) => {
    if(!selectedImageType) return

    console.log(image.id)
    if(selectedImageType === "edit") return 

    if (selectedImages.some(img => img.id === image.id)) {
      setSelectedImages(prev => prev.filter(img => img.id !== image.id))
    } else {
      setSelectedImages(prev => [...prev, image])
    }
  }

  const handleClickEdit = () => {
    if(selectedImageType !== "edit"){
        setSelectedImageType("edit")
    }else{
        setSelectedImageType(null)
    }
  }

  const handleClickDelete = () => {
    if(selectedImageType !== "delete"){
        setSelectedImageType("delete")
    }else{
        setSelectedImageType(null)
    }
  }

   const handleDeleteImages = () => {
    console.log("Usuwanie obrazów:", selectedImages)
    deleteImages(selectedImages.map(img => img.public_id))
   }

  const handleToggleTags = (imageid: string, type: TagType) => {
    const hasTag = images.find(img => img.id === imageid)?.info.tags.some(tag => tag === type)
    let imagesCopy = [...images]
    const imageIndex = imagesCopy.findIndex(img => img.id === imageid)

    if(hasTag){
        //usuwanie taga
        imagesCopy[imageIndex].info.tags = imagesCopy[imageIndex].info.tags.filter(tag => tag !== type)
    }else{
        //dodawanie taga
        imagesCopy[imageIndex].info.tags.push(type)
    }
    setImages(imagesCopy)
  }
  
  const handleSaveChanges = () => {
    console.log("Zapisywanie zmian:", images)
    // Tutaj możesz dodać logikę zapisywania zmian, np. wysyłając zaktualizowane dane do backendu.
    updateImagesInfo(images)
  }

  const handleToggleFrontPage = (imageid: string) => {
    let imagesCopy = [...images]
    const imageIndex = imagesCopy.findIndex(img => img.id === imageid)
    imagesCopy[imageIndex].info.should_be_on_front_page = !imagesCopy[imageIndex].info.should_be_on_front_page
    setImages(imagesCopy)
  }

  const handleChangeImportance = (imageid: string, value: string) => {
    let imagesCopy = [...images]
    const imageIndex = imagesCopy.findIndex(img => img.id === imageid)
    imagesCopy[imageIndex].info.importance = parseInt(value) || 0
    setImages(imagesCopy)
  }
  
  return (
    <div className="flex flex-col min-h-screen items-center bg-zinc-50 font-sans dark:bg-black justify-start pt-10 px-5">

        <CldUploadWidget 
        signatureEndpoint="/api/sign-cloudinary-params"
        uploadPreset="pazy"
        onSuccess={async (result, { widget }) => {
            console.log(result);
            const id = typeof result?.info === 'object' ? result.info.public_id : undefined


            if (id){
                const result = await addImage(id)
                if(result){
                    setImages(prev => [{...result,date: new Date()}, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
                }
            }
        }}
        >
        {({ open }) => {
            return (
            <button onClick={() => open()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                Dodaj zdjęcie
            </button>
            );
        }}
        </CldUploadWidget>

        <div className="flex gap-2 w-full mt-2">
            <Button 
                text="Edytuj zdjęcia"
                className="w-full flex-1"
                onClick={handleClickEdit}
                isSelected={selectedImageType === "edit"}
            />

            <Button 
                text="Usuń  zdjęcia"
                className="w-full flex-1"
                onClick={handleClickDelete}
                isSelected={selectedImageType === "delete"}
            />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map(image => (<div key={image.id} className="relative" onClick={() => handleImageClick(image)}>
            {selectedImageType === 'delete' && selectedImages.some(img => img.id === image.id) && <div className="absolute z-10 bg-black opacity-80 w-full h-full flex items-center justify-center text-white text-xl">
                {selectedImageType === 'delete' && <CrossIcon />}
            </div>}

            {selectedImageType === 'edit' && 
            <div className="grid-rows-2 gap-4 absolute z-10 bg-black opacity-80 w-full h-full items-center justify-center text-white text-xl">
                <div>
                  {TypyPaznokci.map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <input id={`${type}-${image.id}`} key={type} type="checkbox" checked={image.info.tags.includes(type)} onChange={() => handleToggleTags(image.id, type)} />
                      <label htmlFor={`${type}-${image.id}`}>{type}</label>
                      
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  
                  <input id={`frontPage-${image.id}`} type="checkbox" checked={image.info.should_be_on_front_page} onChange={() => handleToggleFrontPage(image.id)} />
                  <label htmlFor={`frontPage-${image.id}`}>Strona główna</label>
                  
                </div>

                <div className="mt-4">
                  <label htmlFor={`importance-${image.id}`}>Ważność</label>
                  <input id={`importance-${image.id}`} type="number" className="border rounded pl-1" value={image.info.importance} onChange={(e) => handleChangeImportance(image.id, e.target.value)} />

                </div>
            </div>}
            <CldImage key={image.id} src={image.public_id} width={300} height={300} alt="Uploaded image" className="mb-4" />
          </div>
          ))}
        </div>

        <div className="fixed bottom-5 w-full px-5 z-20">
          {selectedImageType === "delete" && 
          <div className="flex gap-4 flex-row">
            <Button text="Anuluj" isPrimary className="  border-red-500 border-2 flex-1" onClick={()=>setSelectedImageType(null)} />
            <Button text="Usuń zaznaczone" className="bg-red-500 hover:bg-red-600 flex-1" onClick={handleDeleteImages} />
          </div>}

          {selectedImageType === "edit" && 
          <div className="flex gap-4 flex-row">
            <Button text="Anuluj" isPrimary className="border-green-500 border-2 flex-1" onClick={()=>setSelectedImageType(null)} />
            <Button text="Zapisz zmiany" className="bg-green-500 hover:bg-green-600 flex-1" onClick={handleSaveChanges} />
          </div>}
        </div>
    </div>
  );
}

export default Home;