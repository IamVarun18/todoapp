import Head from "next/head";
import TodoList from "./Components/TodoList";

export default function Page() {
  return (
    <div className="min-h-screen h-[80vh] flex items-start justify-center bg-[#b39ae6]">
      <Head>
        <title>Task Manager</title>
      </Head>
      <TodoList />
    </div>
  );
}
