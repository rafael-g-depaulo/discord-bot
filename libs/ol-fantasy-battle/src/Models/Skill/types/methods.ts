import { InstanceMethod, StaticMethod, VirtualGetter } from "../../helpers"
import { BaseSkillDocument, SkillDocument } from "."
import SkillModel from ".."

// type defition for instance method
export interface SkillInstanceMethod<M extends (...args: any) => any> extends InstanceMethod<BaseSkillDocument, M> {}
// type defition for instance method
export interface SkillStaticMethod<M extends (...args: any) => any> extends StaticMethod<SkillDocument, SkillModel, M> {}
// type defition for a function defining an instance virtual property
export interface SkillVirtualGetter<T> extends VirtualGetter<BaseSkillDocument, T> {}
