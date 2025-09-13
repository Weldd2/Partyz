import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ngrok http https://localhost --host-header="localhost"
const BASE_URL = "https://44eb9a4aa561.ngrok-free.app/api";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationOptions {
	invalidateKeys?: string[];
}

export default function useApi<T>(resourceType: string, endpoint: string) {
	return useQuery({
		queryKey: [resourceType, endpoint],
		queryFn: (): Promise<T> =>
			fetch(`${BASE_URL}${endpoint}`).then((res) => res.json()),
	});
}

type EndpointOrFn<TVariables> = string | ((variables: TVariables) => string);

export function useApiMutation<TData, TVariables>(
	endpoint: EndpointOrFn<TVariables>,
	method: HttpMethod = "POST",
	options?: MutationOptions,
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables: TVariables): Promise<TData> => {
			const resolvedEndpoint =
				typeof endpoint === "function" ? endpoint(variables) : endpoint;

			const contentType =
				method === "PATCH"
					? "application/merge-patch+json"
					: "application/ld+json";

			const response = await fetch(`${BASE_URL}${resolvedEndpoint}`, {
				method,
				headers: {
					"Content-Type": contentType,
					Accept: "application/ld+json",
				},
				body:
					method !== "DELETE" ? JSON.stringify(variables) : undefined,
			});

			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}

			if (response.status === 204) {
				return {} as TData;
			}

			return response.json();
		},
		onSuccess: () => {
			if (options?.invalidateKeys) {
				options.invalidateKeys.forEach((key) => {
					queryClient.invalidateQueries({ queryKey: [key] });
				});
			}
		},
	});
}
