import type { IncomingMessage, ServerResponse } from 'http'

export function createPaymentOrder(
  req: IncomingMessage & { body?: any },
  res: ServerResponse & { status: (code: number) => any; json: (data: any) => any }
): Promise<any>

export function verifyPaymentSignature(
  req: IncomingMessage & { body?: any },
  res: ServerResponse & { status: (code: number) => any; json: (data: any) => any }
): any
