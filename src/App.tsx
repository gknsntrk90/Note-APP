import { data, Navigate, Route, Routes } from "react-router-dom"
import NewNote from "./components/Form/NewNote"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";
import { useMemo, useState } from "react";
import { NoteData, RawNote, Tag } from "./types";
import { useLocaleStorage } from "./useLocaleStorage";
import { v4 } from "uuid";
import MainPage from "./MainPage";
import Layout from "./components/NoteDetail/Layout";
import NoteDetail from "./components/NoteDetail/NoteDetail";
import EditNote from "./components/Form/EditNote";



function App() {

  const [notes, setNotes] = useLocaleStorage<RawNote[]>("notes", []);
  const [tags, setTags] = useLocaleStorage<Tag[]>("tags", []);

  //notları etiketlerindeki id değerleriyle eşleşen etiketleri al
  // hesaplamayı performans cachle
  const noteWithTags = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      tags: tags.filter((tag) => note.tagIds.includes(tag.id)), 
    }));
  }, [notes, tags]);

  // local'e yeni not ekler
  function onCreateNote({ tags, ...data}: NoteData) {
    setNotes((prev) => {
      return [
        ...prev,
        { ...data, id: v4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

// locak'e yeni etiket ekler
function addTag(tag: Tag) {
  setTags((prev) => [...prev, tag]);
}

// Elemanı siler
function onDeleteNote(id: string) {
  setNotes((prevNotes) => {
    return prevNotes.filter((n) => n.id !== id);
  });
}

// Elemanı GÜnceller
function onUpdateNote(id:string, {tags,...data}:NoteData){
  setNotes((prev) => {
    return prev.map((n) => {
      // dizideki eleman güncellenecek not ise tüm değerlerini değiştir
      if(n.id === id){
        return {
          ...n,
          ...data,
          tagIds: tags.map((tag) => tag.id),
        };
      }else {
        return n;
      }
    })
  })
}

  return (
    <Container className="my-4">
   <Routes>
    <Route path="/" element={<MainPage notes={noteWithTags} availableTags={tags}/>} />
    <Route path="/new" element={<NewNote 
    onSubmit={onCreateNote} 
    addTag={addTag} 
    availableTags={tags}/>
  } />

    <Route path="/:id" element={<Layout notes={noteWithTags} />}>
      <Route index element={<NoteDetail onDeleteNote={onDeleteNote}/>} />
      <Route path="edit" element={<EditNote 
       onSubmit={onUpdateNote} 
       onAddTag={addTag}
        availableTags={tags}/>} />
    </Route>

    <Route path="*" element={<Navigate to={'/'} />} />
   </Routes>
   </Container>
  )
}

export default App