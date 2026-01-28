import css from "./Reading.module.css";
import { AddReading } from "../../components/AddReading/AddReading";
import { useEffect, useState, useMemo } from "react";
import type { Book } from "../../api/reading";
import { getBook } from "../../api/reading";
import { useParams } from "react-router-dom";

export default function Reading() {
  const [book, setBook] = useState<Book | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await getBook(id);
        setBook(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const isReading = useMemo(
    () => !!book?.progress?.some((p) => p.status === "active"),
    [book],
  );

  return (
    <div className={css.container}>
      <div className={css.window}>
        <AddReading book={book} isReading={isReading} onBookUpdate={setBook} />
      </div>
    </div>
  );
}
