'use client';
import { useState } from 'react';
export default function Home() {
  const [x] = useState(1);
  return <div>Hello {x}</div>;
}