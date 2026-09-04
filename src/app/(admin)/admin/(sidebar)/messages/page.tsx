import { MessagesPage } from "@/components/admin/MessagesPage";
import { getMessages } from "@/data-access/message-data-access";

export const dynamic = "force-dynamic";

export default async function Page() {
    const messages = await getMessages();

    return <MessagesPage initialMessages={messages} />;
}
