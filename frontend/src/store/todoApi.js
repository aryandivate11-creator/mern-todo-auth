import { apiSlice } from "./apiSlice";

export const todoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: ({ page = 1, search = "" }) =>
        `/api/todos?page=${page}&limit=5&search=${search}`
    }),

    createTodo: builder.mutation({
      query: (body) => ({
        url: "/api/todos",
        method: "POST",
        body
      })
    }),

    updateTodo: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/todos/${id}`,
        method: "PUT",
        body
      })
    }),

    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/api/todos/${id}`,
        method: "DELETE"
      })
    })
  })
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation
} = todoApi;
