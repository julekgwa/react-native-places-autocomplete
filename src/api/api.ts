export interface IResponse<T> {
  response: T;
  status: number;
}

export class Api {
  static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<IResponse<T>> {
    const res = await fetch(url, options);
    const response = await res.json();

    return {
      response: response as T,
      status: res.status,
    };
  }
}
