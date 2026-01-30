# Read Journey 📚

## About the project
**Read Journey** is a web app for tracking your reading progress.  
A user can:
- browse **Recommended** books (from the backend),
- add books to **My Library**,
- start/stop reading on the **Reading page**,
- view reading history as a **Diary** (reading sessions by date),
- view progress as **Statistics** (progress chart/ring).

---

## Main features

### Recommended
- Fetch recommended books from the backend (with pagination).
- Open a modal with book details.
- Add a book to **My Library** (**Add to my library** button).
- Handle backend errors using toast notifications (including duplicates like **409 Conflict**).

### My Library
- Display the user’s saved books.
- Delete a book from the library.
- Open a modal with book details.
- Filter books by reading status (if required by the spec).

### Reading page
The Reading page contains:
- **AddReading** — a form with 1 input and a submit button:
  - **"To start"** — start reading from page `page`
  - **"To stop"** — stop reading at page `page`
  - all form values are validated (yup)
  - backend errors are shown as notifications (toast)
- **MyBook** — book block + reading status indicator:
  - after a successful `start`, the indicator shows the book is “in progress”
- **Details** — detailed reading information:
  - **Diary** or **Statistics** (toggle switch)

#### “Book finished” logic
After clicking **To stop**, if `stopPage === totalPages`, a “book finished” modal is opened.

---

## Details: Diary / Statistics

### Diary
Shows reading sessions grouped by date. Each record includes:
- date
- pages read
- reading time (minutes)
- percent of the book
- reading speed (calculated on the backend)
- delete button (sends a request to remove the reading event)

### Statistics
Shows book progress as a chart (progress ring):
- total percent read
- total pages read

---

## Tech stack
- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **Axios** (API requests)
- **CSS Modules**
- **react-toastify** (notifications/toasts)
- **yup** (form validation)
- **react-spinners** (loader)

---

## API / Backend
The project uses the ReadJourney API (GoIT backend). Main requests:
- recommended books (fetch list, add to library)
- my library (fetch list, delete book)
- reading (get book, start reading, stop reading, delete reading event)

---

## Design (Mockup)
The UI is implemented according to the provided design:
- responsive layout (Mobile / Tablet / Desktop)
- modals for book details and “book finished”
- Diary / Statistics toggle

> If you have a Figma link, add it here: `Figma link: ...`

---

## Specification (Summary)
Implemented requirements include:
- Dashboard is a reusable wrapper component (content depends on the page)
- Reading page includes AddReading, MyBook, Details
- AddReading: 1 input + submit button (“To start” / “To stop”)
- validation + backend error handling via notifications
- after stop, Details data updates (speed/progress from backend)
- if the book is finished → show “book finished” modal
- Details has two modes: Diary and Statistics
- Diary: reading events by date + ability to delete an event
- Statistics: progress visualization (chart/ring)

---

## Run locally

1) Clone:
```bash
git clone https://github.com/vlada-marchenko/read_journey.git
cd read_journey
