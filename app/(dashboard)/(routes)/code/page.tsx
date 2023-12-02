"use client"
import * as z from 'zod';
import { useForm } from 'react-hook-form'
import {formSchema} from "./constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import axios from 'axios'
import ReactMarkdown from "react-markdown"

const CodePage = () => {
   const router = useRouter();
   const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
   const form = useForm<z.infer<typeof formSchema>>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       prompt: "",
     },
   });
 
   const isLoading = form.formState.isSubmitting;
 
   const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try {
       const userMessage: ChatCompletionMessageParam = {
         role: "user",
         content: values.prompt,
       };
 
       const newMessages = [...messages, userMessage];
 
       const response = await axios.post("/api/code", {
         messages: newMessages,
       });
 
       setMessages((current) => [...current, userMessage, response.data]);
 
       form.reset();
     } catch (error: any) {
       console.error(error);
     } finally {
       router.refresh();
     }
   };
 
   return (
     <>
       <div>Hello Conversation</div>
 
       <div>
         <div>
           <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)}>
               {/* Correct the name attribute to 'prompt' */}
               <FormField name='prompt' render={({ field }) => (
                 <FormItem className='col-span-12 lg:col-span-10'>
                   <FormControl className='m-0 p-0'>
                     <Input
                       className='border-3 border-cyan-800'
                       disabled={isLoading}
                       placeholder='Enter your prompt'
                       {...field}
                     />
                   </FormControl>
                 </FormItem>
               )} />
               <Button className='col-span-12 lg:col-span-2' disabled={isLoading}>
                 Generate
               </Button>
             </form>
           </Form>
         </div>
         <div className='space-y-4 mt-4'>
           <div className='flex flex-col-reverse gap-y-4'>
             {messages.map((message: any) => (
               <div key={message.content}>
                <ReactMarkdown>
                {message.content || ""}
                </ReactMarkdown>
                </div>
             ))}
           </div>
         </div>
       </div>
     </>
   );
 };
 
 export default CodePage;