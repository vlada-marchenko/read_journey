import css from './AddBook.module.css'
import { useState } from "react";
import * as yup from 'yup'
import { useMemo } from 'react';
import { addBook } from '../../api/recommended';
import { toast } from 'react-toastify';
import Icon from '../Icon/Icon';

const schema = yup.object({
  title: yup
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title is too long")
    .required("Title is required"),
  author: yup
    .string()
    .trim()
    .min(2, "Author must be at least 2 characters")
    .max(100, "Author is too long")
    .required("Author is required"),
  pages: yup
    .number()
    .typeError("Pages must be a number")
    .integer("Pages must be an integer")
    .min(1, "Pages must be at least 1")
    .max(100000, "Pages is too large")
    .required("Pages is required")
});

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [, setIsSubmitting] = useState(false);
  const [, setErrors] = useState<FormErrors>({});

  type FormErrors = {
    title?: string;
    author?: string;
    pages?: string;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setCreated] = useState<{ title: string; author: string; pages?: number} | null>(null)  

  const values = useMemo(() => ({
    title,
    author,
    pages: pages.trim() === '' ? undefined : Number(pages)
  }), [title, author, pages])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsSubmitting(true)

      const validated = await schema.validate(values)

      await addBook({
        title: validated.title.trim(),
        author: validated.author.trim(),
        totalPages: validated.pages
      })

      window.dispatchEvent(new Event("library:changed"));

      setCreated({ title: validated.title.trim(), author: validated.author.trim(), pages: validated.pages })
      setIsModalOpen(true)

      setTitle('')
      setAuthor('')
      setPages('')
    } catch (err: unknown) {
            if (err instanceof yup.ValidationError) {
        const next: FormErrors = {};
        err.inner.forEach((e) => {
          if (e.path && !next[e.path as keyof FormErrors]) {
            next[e.path as keyof FormErrors] = e.message;
          }
        });
        setErrors(next);
        toast.error("Please fix the highlighted fields");
        return;
      }

  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = err as any;
      const apiMessage =
        anyErr?.response?.data?.message ||
        anyErr?.response?.data?.error ||
        anyErr?.message;

      toast.error(apiMessage || "Failed to add book");
      return
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={css.page}>
          <span className={css.span}>Create your libary:</span>
          <form action="submit" className={css.form} onSubmit={onSubmit}>
            <div className={css.field}>
              <label htmlFor="title" className={css.label}>
                Book title:
              </label>
              <input
                id="title"
                type="text"
                className={`${css.input} ${css.inputTitle}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={css.field}>
              <label htmlFor="author" className={css.label}>
                The author:
              </label>
              <input
                id="author"
                type="text"
                className={`${css.input} ${css.inputAuthor}`}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
                        <div className={css.field}>
              <label htmlFor="pages" className={css.label}>
                Number of pages:
              </label>
              <input
                id="pages"
                type="text"
                className={`${css.input} ${css.inputPages}`}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
            </div>
            <button className={css.button} type="submit" >
              Add book
            </button>
          </form>

        {isModalOpen && (
          <div className={css.backdrop} onClick={() => setIsModalOpen(false)} aria-modal="true" role="dialog">
            <div className={css.modal}>
              <button type="button" className={css.closeButton} onClick={() => setIsModalOpen(false)}> <Icon name="close" /></button>
             
              <div className={css.content}>
                <span className={css.emojii}>👍</span>
                <h3 className={css.title}>Good job</h3>
                <p className={css.text}>Your book is now in <span className={css.spanText}>the library!</span>  The joy knows no bounds and now you can start your training</p>
              </div>
            </div>
          </div>
        )}
        </div>)}