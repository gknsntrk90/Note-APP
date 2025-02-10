import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import ReactSelect from 'react-select/creatable';
import { NoteData, Tag } from "../../types";
import { NewNoteProps } from "./NewNote";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";


type NoteFormProps = {
    onSubmit: (data:NoteData) => void;
};

const NoteForm = ({onSubmit,
     addTag, 
     availableTags,
     title = '',
     markdown = '',
     tags = [],
    }: NewNoteProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const navigate = useNavigate();

    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();

        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags,
        });

        //kullanıcının geldiği sayfaya geri gönderir geçmişte 1 adım geri gider
        navigate(-1)
    };

   

    return (
   <Form onSubmit={handleSubmit}>
    <Stack gap={4}>
        <Row>
            <Col>
            <Form.Group controlId="title">
                <Form.Label>Başlık</Form.Label>
                <Form.Control ref={titleRef} required 
                className="shadow"
                defaultValue={title}
                />
            </Form.Group>
            </Col>
            <Col>
            <Form.Group controlId="tags">
                <Form.Label>Etiketler</Form.Label>
                <ReactSelect 
                // SAHİP OLACAĞI ETİKETLER
                value={selectedTags.map((tag) => ({
                    label:tag.label,
                    value:tag.id,
                }))}
                // ONCHANGE
                onChange={(tags) => 
                    setSelectedTags(
                    tags.map((tag) => ({
                    label:tag.label,
                    id:tag.value,
                }))
            )
            }
            // Yeni etiket oluşturulduğunda onCreate tetikleniyor
                onCreateOption={(label) => {
                    const newTag:Tag = {id:v4(),label}
                    addTag(newTag)
                    setSelectedTags((prev) => [...prev, newTag]);
                }}
                 // daha önceden eklenen etiketleri listele
                 options={availableTags.map((tag) => ({
                    label: tag.label,
                    value: tag.id,
                }))}
                isMulti
                className="shadow"
                />
            </Form.Group>
            </Col>
        </Row>
{/* TEXT İÇERİĞİ */}
            <Form.Group controlId="markdown">
                <Form.Label>İçerik</Form.Label>
                <Form.Control 
                defaultValue={markdown}
                ref={markdownRef}
                as={'textarea'} 
                rows={15} 
                required 
                className="shadow" 
                />
            </Form.Group>
{/* BUTTONLAR */}
            <Stack
            direction="horizontal"
            gap={2}
            className="justfiy-content-end"
            >
                <Button type="submit">Kaydet</Button>
                <Button onClick={() => navigate(-1)} type="button" variant="secondary">
                    iptal
                </Button>
            </Stack>
    </Stack>
   </Form>
  )
}

export default NoteForm