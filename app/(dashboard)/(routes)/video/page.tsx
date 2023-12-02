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
import axios from 'axios'
import { Music, Send } from "lucide-react";

const VideoPage = () => {
   const router = useRouter();
   const [video, setVideo] = useState<string>();
   const form = useForm<z.infer<typeof formSchema>>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       prompt: "",
     },
   });
 
   const isLoading = form.formState.isSubmitting;
 
   const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try {
       setVideo(undefined)
       
       const response = await axios.post("/api/video", values)
       setVideo(response.data[0])
       form.reset();
     } catch (error: any) {
       console.error(error);
     } finally {
       router.refresh();
     }
   };
 
   return (
     <>
       <div>Video Generation</div>
 
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
                       placeholder='Enter your prompt to generate Video'
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
             <div>
                {video && (
                 
                 <video className='w-full aspect-video mt-8 rounded-lg border bg-black controls'>
                    <source src={video} />
                 </video>
                 
                )}
             </div>
         </div>
       </div>
     </>
   );
 };
 
 export default VideoPage;