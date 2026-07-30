import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { startInstance } from './start'

export default createStartHandler(defaultStreamHandler)(startInstance)
