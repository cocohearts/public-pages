Rust is a parallel language to C++, with many similar ideas (static typing, compiled language) but also many new ones (very strong compiler guarantees, safe/unsafe code).

Here are some the of the key ideas.
# Rust Compiler Stronk
### Ownership
Every item is owned by some variable name. The code must always "know" what each object is owned by. For instance, a vector owns all of its constituents. These are the permitted operations:
- Immutable borrow (must be "returned")
- Mutable borrow (can write, nobody else can borrow, must be "returned")
- Move (change ownership, previous variable gets "consumed")
When passing `&var` or `&mut var` in a function signature, that's a borrow. But when directly passing `var`, that's a move, and the original variable cannot be accessed anymore.

Consuming can be a good API for when an object should not be used anymore after a function call, i.e. all of the important guts got "moved" out.

There's lots of work that goes into moving objects that can't be `clone()`, such as `remove()` and `swap()`.
### Lifetimes
There are also lifetimes, which the compiler usually infers but sometimes special things need to be done.
- Suppose A has a skateboard, B borrows the skateboard from A, and C borrows a sticker on the skateboard from B. Then C gives the sticker to D (function return).
- The first borrow must last at least as long as the second borrow, i.e. the reference must live at least as long.

This is only used when change of scope happens and the second reference moves out of the scope e.g. function calls. If the sticker is borrowed in "inline" code the skateboard reference is immediately required to live that long.
### Safety paradigms
C++ makes the choice of making the programmer check guarantees at *runtime*. The Rust compiler enforces certain guarantees at *compile-time* so that those bugs can be found earlier by the compiler, rather than in production.

The errors thrown at compiletime are usually *panics*, such as division by zero, unwrapping a None value, 
# Typing choices
### Traits
Rust borrows a lot from type theory, while mixing in some of the compiled-language efficiency of C++. Namely, all objects have static types, defined with the `struct` keyword.

Traits are a "property" that multiple types can satisfy. Traits can provide "associated types" and methods.

Functions have their arguments be a certain type, but they can also have arguments satisfy certain traits.
### Generics
Syntactically, generic types are integrated into function signatures and traits in a way different from other languages. Rust's rigorous type checking encourages frequent use of generics. Generics can also be required to have trait bounds, so that e.g. an argument assumed to be of a certain type satisfying a given trait can call the methods from that trait, and Rust will know those methods exist.

Traits with different generics become different traits, so `MyTrait<i32>` and `MyTrait<bool>` can both be implemented by the same type.
### Enums
An enum is syntactic sugar for some type to be one of a list of hard-coded types. There is special `match` syntax that allows for concise control flow depending on the type of an enum.
### The `Option<T>` type
The `Null` type is just horrible. Hence, the `Option<T>`, which is an enum for either `None` or `T`. Calling `None.unwrap()` will `panic!()`.
### Trait objects
There is a special `&dyn Trait` keyword that allows for pointers to a set of objects that satisfy a given trait. Then these objects could be any type that implements the trait, allowing for expandable features.
This is implemented under the hood with a *vtable* matching types to function pointers.
### Smart pointers
There's `Box`, `Mutex`, `Rc`, `Arc`, when the reference doesn't suffice. Just google if necessary.

Specifically, the `Box` moves its contents to heap and adds a pointer to the object on the stack, returning the pointer. It puts the object in a box.
# Other Rust specifics
### Iterators
Oh, my god! these are awesome. Calling `.iter()` on a collection will create an object satisfying the `Iterator` trait, i.e. it has `next()` etc. creating immutable borrow. Then there's `iter_mut()` which returns mutable borrows, and `into_iter()` creating iterators that own the respective objects.
### Unsafe code
When exposing some key functionality such as splitting a vector (consuming a mutable slice and returning two halves of that slice) unsafe code must be used. It's wrapped in a `unsafe` code block, and it's up to the programmer to check that the *contracts* of that function are satisfied.
### Tests
Rust has builtin configs such as `#[cfg(test)]` that makes unit tests and integration tests very easy.
### Routing
Code is organized into crates. Crates are split into "library" denoted by `src` and "binary" denoted by `bin`. The binaries are meant for production, and libraries as APIs for binaries or other projects.

Cyclic imports between crates is not allowed, but any imports within one crate is fine. Imports from other crates need to be declared in `Cargo.toml`, along with other compilation and testing options. `mod` creates a module, and `use` imports things.

Obviously, the placement and naming of files can determine their import paths.
### Macros
Every `#[...]` generates code of some kind, using a `TokenStream` of the code block below it. All the `macro!()` lines apply some pattern to generate code in place at compile time, in a way similar to functions, except the assembly is quite literally expanded.
### Parallelism
Can initiate multiple threads. Object must implement `Send` if its ownership is going to be transferred to another thread, and must implement `Sync` if its references can be sent between threads (i.e. multiple threads can read/write). So constants are Send, and Arc/Mutex are Sync, etc.