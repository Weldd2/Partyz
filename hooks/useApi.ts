import { useQuery } from "@tanstack/react-query";

// ngrok http https://localhost --host-header="localhost"
const BASE_URL = "https://44eb9a4aa561.ngrok-free.app/api";

export default function useApi<T>(resourceType: string, endpoint: string) {
	return useQuery({
		queryKey: [resourceType, endpoint],
		queryFn: (): Promise<T> =>
			fetch(`${BASE_URL}${endpoint}`).then((res) => res.json()),
	});
}
