const KEY = "chat_messages";

const TTL = 1000 * 60 * 60 * 24; // 24h

export function saveMessages(messages: any[]) {
	const payload = {
		messages,
		timestamp: Date.now(),
	};

	sessionStorage.setItem(KEY, JSON.stringify(payload));
}

export function loadMessages() {
	const raw = sessionStorage.getItem(KEY);
	if (!raw) return null;

	try {

		const data = JSON.parse(raw);

		if (Date.now() - data.timestamp > TTL) {
			sessionStorage.removeItem(KEY);
			return null;
		}

		return data.messages;

	} catch {

		return null;
		
	}
}