;; guestbook.clar - On-chain guestbook for Stacks bounty

(define-map posts principal {
  content: (string-ascii 200),
  index: uint
})

(define-data-var next-id uint u0)
(define-data-var post-count uint u0)

(define-public (post-message (content (string-ascii 200)))
  (let (
    (author tx-sender)
    (id (var-get next-id))
    (count (var-get post-count))
  )
    (begin
      (var-set next-id (+ id u1))
      (var-set post-count (+ count u1))
      (map-insert posts author {
        content: content,
        index: id
      })
      (ok u1)
    )
  )
)

(define-read-only (get-post-count)
  (ok (var-get post-count))
)

(define-read-only (get-post-by-author (author principal))
  (unwrap! (map-get? posts author) {
    content: "",
    index: u0
  })
)
