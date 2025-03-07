// components/Maps/Maps.tsx
'use client';
import dynamic from 'next/dynamic';
import { MapProps } from './ReactMap';

// const DynamicMap = dynamic(() => import('./DynamicMap'), { ssr: false });

const ReactMap = dynamic(() => import('./ReactMap'), { ssr: false });

export default function Maps(props: Readonly<MapProps>) {

  return <ReactMap {...props}/>;
}