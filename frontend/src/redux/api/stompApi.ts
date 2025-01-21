// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {stompClient} from "../../stomp/client.ts";

interface Greeting {
    content: string,
}

// Define a service using a base URL and expected endpoints
export const stompApi = createApi({
    reducerPath: 'stompApi',
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    endpoints: (builder) => ({
        getConnectionStatus: builder.query<boolean, void>({
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
        getGreeting: builder.query<string, void>({
            queryFn: () => {
                return {
                    data: '',
                };
            },
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }){
                console.log('getGreeting...');
                await cacheDataLoaded;

                // stompClient.onConnect = (frame) => {
                //     console.log('frame: ', frame);
                    stompClient.subscribe('/topic/greeting', (data) => {
                        const body = JSON.parse(data.body) as Greeting;
                        console.log('body: ', body);
                        updateCachedData(() => {
                            return body.content;
                        });
                    });
                // }

                await cacheEntryRemoved;
            }
        }),
        getItemList: builder.query<string[], void>({
            queryFn: () => {
                return {
                    data: [],
                };
            },
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }){
                console.log('getGreeting...');
                await cacheDataLoaded;

                stompClient.subscribe('/topic/item', (data) => {
                    const body = JSON.parse(data.body) as string[];
                    console.log('body: ', body);
                    updateCachedData(() => {
                        return body;
                    });
                });

                await cacheEntryRemoved;
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
    }),
});

export const { useGetConnectionStatusQuery, useSendNameMutation, useGetGreetingQuery, useGetItemListQuery } = stompApi;
