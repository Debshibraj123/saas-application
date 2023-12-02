"use client"
import * as z from 'zod';
import { useForm } from 'react-hook-form'
import {amountOptions, formSchema, resolutionOptions} from "./constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Download } from 'lucide-react';

const ImagePage = () => {
   const router = useRouter();
   const [images, setImages] = useState<string[]>([])
   
   const form = useForm<z.infer<typeof formSchema>>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       prompt: "",
       amount: "1",
       resolution: "512x512"
     },
   });
 
   const isLoading = form.formState.isSubmitting;
 
   const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try {
       setImages([]);

       console.log(values);
       
       const response = await axios.post("/api/image", values);
       
       const urls = response.data.map((image: {url : string}) => image.url)
   
       setImages(urls);
       form.reset();
     } catch (error: any) {
       console.error(error);
     } finally {
       router.refresh();
     }
   };
 
   return (
     <>
       <div className='mt-0 flex font-4xl justify-center'>Hello Generate Images as per your need</div>
 
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
                       placeholder='Enter your prompt to generate image'
                       {...field}
                     />
                   </FormControl>
                 </FormItem>
               )} />
                
                <FormField 
                  control={form.control}
                  name='amount'
                  render={({ field }) =>( 
                      <FormItem className='col-span-12 lg:col-span-6'>
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                             <FormControl>
                                <SelectTrigger>
                                  <SelectValue defaultValue={field.value} />
                                </SelectTrigger>
                             </FormControl>

                             <SelectContent>
                               {amountOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                               ))}
                             </SelectContent>


                          </Select>
                      </FormItem>
                    )}
                />

                <FormField 
                  control={form.control}
                  name='resolution'
                  render={({ field }) =>( 
                      <FormItem className='col-span-12 lg:col-span-6'>
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                             <FormControl>
                                <SelectTrigger>
                                  <SelectValue defaultValue={field.value} />
                                </SelectTrigger>
                             </FormControl>

                             <SelectContent>
                               {resolutionOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                               ))}
                             </SelectContent>


                          </Select>
                      </FormItem>
                    )}
                />
                
               <Button className='col-span-12 lg:col-span-2' disabled={isLoading}>
                 Generate
               </Button>
             </form>
           </Form>
         </div>
         <div className='space-y-4 mt-4'>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {images.map((src) => (
            <Card key={src} className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  fill
                  alt="Generated"
                  src={src}
                />
              </div>
              <CardFooter className="p-2">
                <Button onClick={() => window.open(src)} variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         </div>
       </div>
     </>
   );
 };
 
 export default ImagePage;