export default function FormSubmit() {
    if (status.pending) {
        return <p>Creating post...</p>
    }

    return (
        <>
            <button type="reset">Reset</button>
            <button>Create Post</button>
        </>
    )
}