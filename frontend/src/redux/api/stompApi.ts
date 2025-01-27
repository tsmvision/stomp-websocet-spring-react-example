// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {stompClient} from "../../stomp/client.ts";

export interface Greeting {
    content: string,
}

const CLEAR = 'CLEAR';

// Define a service using a base URL and expected endpoints
export const stompApi = createApi({
    reducerPath: 'stompApi',
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    tagTypes: [CLEAR],
    endpoints: (builder) => ({
        getConnectionStatus: builder.query<boolean, void>({
            providesTags: [CLEAR],
            queryFn: () => {
                return {
                    data: false
                };
            },
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }){
                await cacheDataLoaded;

                stompClient.onConnect = ()=> {
                    updateCachedData(() => {
                        return true;
                    });
                };

                stompClient.onDisconnect = () => {
                    updateCachedData(() => {
                        return false;
                    })
                };

                await cacheEntryRemoved;
            }
        }),
        getGreeting: builder.query<Greeting | undefined, void>({
            providesTags: [CLEAR],
            queryFn: () => {
                return {
                    data: undefined,
                };
            },
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }){
                console.log('getGreeting...');
                await cacheDataLoaded;

                    // console.log('frame: ', frame);
                const handler = stompClient.subscribe('/topic/greeting', (data) => {
                    const body = JSON.parse(data.body) as Greeting;
                    console.log('body: ', body);
                    updateCachedData(() => {
                        return body;
                    });
                });
                await cacheEntryRemoved;
                handler.unsubscribe();
            }
        }),
        getItemList: builder.query<string[], void>({
            providesTags: [CLEAR],
            queryFn: () => {
                return {
                    data: [],
                };
            },
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }){
                console.log('getGreeting...');
                await cacheDataLoaded;

                const handler = stompClient.subscribe('/topic/item', (data) => {
                    const body = JSON.parse(data.body) as string[];
                    console.log('body: ', body);
                    updateCachedData(() => {
                        return body;
                    });
                });

                await cacheEntryRemoved;
                handler.unsubscribe();
            }
        }),
        sendName: builder.mutation<void, string>({
            queryFn: (name) => {
                    stompClient.publish({
                        destination: "/app/greeting",
                        body: JSON.stringify({'name': name}),
                    });
                return {
                    data: undefined,
                };
            },
        }),
        // disconnect: builder.mutation<void, string>({
        //     invalidatesTags: [CLEAR],
        //     queryFn: (name) => {
        //         stompClient.publish({
        //             destination: "/app/greeting",
        //             body: JSON.stringify({'name': name}),
        //         });
        //         return {
        //             data: undefined,
        //         };
        //     },
        // }),

    }),
});

export const { useGetConnectionStatusQuery, useSendNameMutation, useGetGreetingQuery, useGetItemListQuery } = stompApi;
