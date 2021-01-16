import { InstanceMethod, StaticMethod, VirtualGetter } from "../../helpers"
import { BasePcDocument, PcDocument } from "."
import PcModel from ".."

// type defition for instance method
export interface PcInstanceMethod<M extends (...args: any) => any> extends InstanceMethod<BasePcDocument, M> {}
// type defition for instance method
export interface PcStaticMethod<M extends (...args: any) => any> extends StaticMethod<PcDocument, PcModel, M> {}
// type defition for a function defining an instance virtual property
export interface PcVirtualGetter<T> extends VirtualGetter<BasePcDocument, T> {}
