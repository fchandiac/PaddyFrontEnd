import React from 'react';

export interface User {
    id: string;
    userName: string;
    name: string;
    email: string;
    role: string;
    commerceId: string;
}

export default function useUsers() {
  return <div>useUsers</div>;
}
